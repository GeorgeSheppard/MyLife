import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import * as React from "react";
import Layout, { ILayoutProps } from "../components/core/layout";
import { store } from "../store/store";
import { ThemeController } from "../components/core/theme";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/global_card.scss";
import "../styles/scrollbar.scss";
import "../styles/utilities.scss";

export interface IMyLifeProps {
  Component: React.JSXElementConstructor<ILayoutProps>;
  pageProps: ILayoutProps & { session: Session };
}

export default function MyLife(props: IMyLifeProps) {
  const { Component } = props;
  const { session, ...pageProps } = props.pageProps;

  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <ThemeController>
          <SessionProvider session={session}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SessionProvider>
        </ThemeController>
      </DndProvider>
    </Provider>
  );
}
